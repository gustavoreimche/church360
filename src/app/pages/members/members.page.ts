import { Component, inject, OnInit } from '@angular/core';
import { PageWrapperComponent } from '../../components/page-wrapper.component';
import { MembersContext } from '../../api/members.context';
import { IMember } from '../../dto/member.interface';
import { MembersTableComponent } from '../../components/members-table.component';

@Component({
  selector: 'app-members-page',
  templateUrl: 'members-page.html',
  imports: [PageWrapperComponent, MembersTableComponent],
  providers: [MembersContext],
})
export class MembersPage implements OnInit {
  _members = inject(MembersContext);
  members: IMember[] = [];

  ngOnInit(): void {
    this.getData((members: IMember[]) => (this.members = members));
  }

  getData(callback: (res: IMember[]) => void): void {
    this._members.getMembers().subscribe(members => callback(members));
  }
}
