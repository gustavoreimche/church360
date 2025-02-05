import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IMember } from '../dto/member.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-members-table',
  imports: [NzTableModule, DatePipe],
  template: `
    <nz-table #basicTable [nzData]="dataSet() || []" nzTableLayout="fixed">
      <thead>
        <tr>
          @for (column of listOfColumn; track column) {
            <th [nzSortFn]="column.compare" [nzSortPriority]="column.priority">
              {{ column.title }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (data of basicTable.data; track data) {
          <tr>
            <td>{{ data.nome }}</td>
            <td>{{ data.dataNascimento | date: 'dd/MM/yyyy' }}</td>
          </tr>
        }
      </tbody>
    </nz-table>
  `,
})
export class MembersTableComponent {
  dataSet = input<IMember[]>();

  listOfColumn = [
    {
      title: 'Nome',
      compare: (a: IMember, b: IMember) => a.nome.localeCompare(b.nome),
      priority: false,
    },
    {
      title: 'Data Nascimento',
      compare: (a: IMember, b: IMember) => a.dataNascimento?.toString().localeCompare(b.dataNascimento?.toString()),
      priority: false,
    },
  ];
}
